import sys
import json
import cv2
import numpy as np
from PIL import Image
from transparent_background import Remover

def main():
  # Load model
  remover = Remover(mode='fast')
  
  # Usage for image
  img = Image.open('./test/image.jpg').convert('RGB') # read image
  out = remover.process(img) # default setting - transparent background
  out.save('./test/output.png') # save result

# def main():
#   print("Hello, javascript.")

#   data = {
#     "object": {
#       "a": 1,
#       "b": 2,
#     },
#     "array": [1,2,3],
#     "boolean": True,
#     "string": "hello",
#     "number": 1,
#     "null": None,
#   }

#   sys.stdout.write(json.dumps(data))
#   sys.exit(0)

if __name__ == '__main__':
  main()