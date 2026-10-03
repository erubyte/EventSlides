import os, signal, subprocess, sys

chrome, source, output = sys.argv[1:4]
cmd = [
    chrome, '--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run',
    '--no-pdf-header-footer', '--allow-file-access-from-files',
    '--user-data-dir=/private/tmp/codex-bucharest-chrome-pdf-2',
    '--run-all-compositor-stages-before-draw', '--virtual-time-budget=5000',
    '--print-to-pdf=' + output, source,
]
p = subprocess.Popen(cmd, start_new_session=True)
try:
    raise SystemExit(p.wait(timeout=20))
except subprocess.TimeoutExpired:
    os.killpg(p.pid, signal.SIGKILL)
    print('STOPPED_AFTER_20_SECONDS')
    raise SystemExit(124)
