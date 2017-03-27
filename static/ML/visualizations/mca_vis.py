import mca
import pandas as pd
import numpy as np

import sys
import os
sys.path.append(os.path.abspath('..'))

from preprocessing import shroom_dealer

df = shroom_dealer.get_data_frame()

mca_ben = mca.mca(df,cols=["gill-color","stalk-surface-above-ring","ring-type","spore-print-color"], ncols=5)
mca_ind = mca.MCA(df,cols=["gill-color","stalk-surface-above-ring","ring-type","spore-print-color"], ncols=5 benzecri=False)
