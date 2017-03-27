import sys
import os
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

sys.path.append(os.path.abspath('..'))
from preprocessing import shroom_dealer

a_map = shroom_dealer.get_attribute_dictionary()
df = shroom_dealer.get_data_frame()
for col in df.columns:
    print df[col].replace(a_map[col], inplace=True)

#Stacked Bar Graphed
# the cross tab operator provides an easy way to get these numbers
for valY in df.axes[1]:
    for valX in df.axes[1]:
        if valY != valX and valY != "poisonous" and valX != "poisonous":

            poison = pd.crosstab([df[valY], df[valX]], df.poisonous.apply(str))
            poison_norm = poison.div(poison.sum(1).astype(float), axis=0)
            ax = poison_norm.plot(kind='barh', stacked=True)

            plt.savefig('stackedbar/%s.png' % (valY + '--' + valX), bbox_inches='tight')
            plt.close()
