import sys
import json

def main():
  data = {
    "object": {
      "a": 1,
      "b": 2,
    },
    "array": [1,2,3],
    "boolean": True,
    "string": "hello",
    "number": 1,
    "null": None,
  }

  sys.stdout.write(json.dumps(data))
  sys.stdout.flush()
  sys.exit(0)

if __name__ == '__main__':
  main()
  # python text.py hello
  # globals()[sys.argv[1]]()