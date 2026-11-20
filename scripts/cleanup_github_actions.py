#!/usr/bin/env python3
"""Delete completed GitHub Actions runs and all Actions caches for this repository.

Safe by design:
- Does not touch source files, deployments, attestations, Pages, or repository settings.
- Keeps the currently executing run and all runs that are still active.
- Requires --execute; without it, only reports what would be deleted.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

API = "https://api.github.com"
ACTIVE_STATUSES = {"queued", "in_progress", "waiting", "requested", "pending"}


class GitHubAPIError(RuntimeError):
    pass


def request(token: str, method: str, path: str):
    url = f"{API}{path}"
    req = urllib.request.Request(
        url,
        method=method,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "DevImpact-Actions-Cleanup",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as response:
            body = response.read()
            if not body:
                return None
            return json.loads(body.decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        if exc.code in (404, 410):
            return {"_already_gone": True}
        raise GitHubAPIError(f"{method} {path}: HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise GitHubAPIError(f"{method} {path}: {exc}") from exc


def list_all_runs(token: str, repository: str) -> list[dict]:
    runs: list[dict] = []
    page = 1
    while True:
        payload = request(
            token,
            "GET",
            f"/repos/{repository}/actions/runs?per_page=100&page={page}",
        )
        batch = payload.get("workflow_runs", [])
        runs.extend(batch)
        print(f"Fetched page {page}: {len(batch)} runs (total collected: {len(runs)})")
        if len(batch) < 100:
            break
        page += 1
    return runs


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--execute",
        action="store_true",
        help="Perform deletion. Without this flag, run in dry-run mode.",
    )
    args = parser.parse_args()

    token = os.environ.get("GITHUB_TOKEN")
    repository = os.environ.get("GITHUB_REPOSITORY")
    current_run_id = os.environ.get("GITHUB_RUN_ID")

    if not token or not repository:
        print("ERROR: GITHUB_TOKEN and GITHUB_REPOSITORY are required.", file=sys.stderr)
        return 2

    runs = list_all_runs(token, repository)
    candidates = []
    skipped_active = 0
    skipped_current = 0

    for run in runs:
        run_id = str(run.get("id", ""))
        status = run.get("status", "")
        if current_run_id and run_id == current_run_id:
            skipped_current += 1
        elif status in ACTIVE_STATUSES:
            skipped_active += 1
        else:
            candidates.append(run)

    print("\nCleanup plan")
    print(f"- Completed/terminal workflow runs eligible for deletion: {len(candidates)}")
    print(f"- Active runs preserved: {skipped_active}")
    print(f"- Current cleanup run preserved: {skipped_current}")
    print("- Actions caches: all repository caches")
    print("- Deployments, attestations, source files, Pages and project settings: untouched")

    if not args.execute:
        print("\nDRY RUN: nothing was deleted. Re-run with --execute to apply cleanup.")
        return 0

    deleted_runs = 0
    already_missing = 0
    failed_runs = 0

    for index, run in enumerate(candidates, start=1):
        run_id = run["id"]
        try:
            result = request(
                token,
                "DELETE",
                f"/repos/{repository}/actions/runs/{run_id}",
            )
            if result and result.get("_already_gone"):
                already_missing += 1
            else:
                deleted_runs += 1
            if index % 25 == 0 or index == len(candidates):
                print(f"Processed {index}/{len(candidates)} workflow runs")
        except GitHubAPIError as exc:
            failed_runs += 1
            print(f"WARNING: {exc}", file=sys.stderr)
        time.sleep(0.05)

    cache_result = request(
        token,
        "DELETE",
        f"/repos/{repository}/actions/caches",
    )
    if cache_result and cache_result.get("_already_gone"):
        deleted_caches = 0
    else:
        deleted_caches = cache_result.get("total_count", "all available") if isinstance(cache_result, dict) else "all available"

    print("\nCleanup result")
    print(f"- Workflow runs deleted: {deleted_runs}")
    print(f"- Runs already absent: {already_missing}")
    print(f"- Run deletions failed: {failed_runs}")
    print(f"- Cache cleanup response: {deleted_caches}")
    print(f"- Runs preserved (active/current): {skipped_active + skipped_current}")

    if failed_runs:
        print("WARNING: Some workflow runs could not be deleted; inspect the log and rerun if needed.")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
