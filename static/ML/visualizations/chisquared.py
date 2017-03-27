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

def observed_data(attr1, attr2):
    df = shroom_dealer.get_data_frame()

    labels1 = shroom_dealer.get_attribute_dictionary()[attr1]
    labels2 = shroom_dealer.get_attribute_dictionary()[attr2]

    data = []

    for a in df[attr1].cat.categories:
        column = df[attr2][df[attr1] == a].value_counts()
        data.append(column)

    observed = pd.concat(data, axis=1)
    observed.columns = [labels1[a] for a in df[attr1].cat.categories]

    return observed


def expected_data(observed):
    expected = np.zeros(observed.shape)

    total = observed.sum().sum()
    for j in [0, 1]:
        for i, col_total in enumerate(observed.sum()):
            row_total = observed.sum(axis=1)[j]
            expected[j][i] = row_total*col_total/total

    return pd.DataFrame(expected, index=observed.index,
                        columns=observed.columns)


cat_names = shroom_dealer.get_attribute_dictionary().keys()

chisqrs = []
for cat in cat_names:
    if cat != 'poisonous':
        observed = observed_data(cat, 'poisonous')
        expected = expected_data(observed)
        chisqr = (((observed-expected)**2)/expected).sum().sum()
        chisqrs.append((chisqr, cat))

chisqrs = sorted(chisqrs)[::-1]
chisqrs = chisqrs[:10]
values = [d[0] for d in chisqrs]
labels = [d[1].replace("-", "\n") for d in chisqrs]

#index = np.arange(len(chisqrs))
#bar_width = .35
#opacity=0.4
#
#
#plt.title("Attributes most associated with edibility")
#plt.bar(index, values, bar_width, align='center')
#plt.xticks(index, labels)
#plt.ylabel("Chi-squared values")
#plt.autoscale()
#plt.tight_layout()
#plt.show()


