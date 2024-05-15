import sys
import json
import cv2
import numpy as np
from PIL import Image
from transparent_background import Remover

def main(*args):
  # Load model
  remover = Remover(mode='fast')
  
  # Usage for image
  img = Image.open('./test/image.jpg').convert('RGB') # read image
  out = remover.process(img) # default setting - transparent background
  out.save('./test/output.png') # save result

if __name__ == '__main__':
  main(*sys.argv[1:])