import sys
import os
import itertools
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import scipy.stats as stats

sys.path.append(os.path.abspath('..'))
from preprocessing import shroom_dealer

def pairplot():
    df = shroom_dealer.get_data_frame()
    for col in df:
        if col in ['odor', 'spore-print-color', 'gill-color', 'ring-type',
                   'stalk-surface-above-ring']:
            df[col] = df[col].cat.codes + (np.random.rand(len(df),) - .5)/3
        elif col == 'poisonous':
            df[col] = df[col].cat.codes
        else:
            del df[col]

    g = sns.pairplot(df, hue='poisonous', size=2)
    #g.set(xticklabels=[], yticklabels=[])
    plt.autoscale()
    plt.tight_layout()
    plt.show()
    plt.close()


pairplot()
