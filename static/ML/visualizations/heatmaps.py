import sys
import os
import itertools
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

sys.path.append(os.path.abspath('..'))
from preprocessing import shroom_dealer

def heatmap(attr1, attr2,annot=True):
    df = shroom_dealer.get_data_frame()

    labels1 = shroom_dealer.get_attribute_dictionary()[attr1]
    labels2 = shroom_dealer.get_attribute_dictionary()[attr2]

    data = []

    for a in df[attr1].cat.categories:
        column = df[attr2][df[attr1] == a].value_counts()/len(df[df[attr1]==a])
        data.append(column)

    d = pd.concat(data, axis=1)
    d.columns = [labels1[a] for a in df[attr1].cat.categories]

    ticks = [labels2[a] for a in d.index]

    sns.heatmap(d, annot=annot, yticklabels=ticks, fmt='.2f')


    plt.title("{} and {}".format(attr1, attr2))
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.savefig("heatmaps/{}_and_{}.png".format(attr1, attr2))
    plt.clf()

def heatmap_all():
    cat_names = shroom_dealer.get_attribute_dictionary().keys()
    combos = itertools.combinations(cat_names, 2)
    for attr1, attr2 in combos:
        heatmap(attr1, attr2)

def heatmap_important():
    important_pairs = [
    ("gill-attachment","veil-color"),
    ("ring-type","spore-print-color"),
    ("odor","poisonous"),
    ("stalk-shape","stalk-roots")
    ]

    for x,y in important_pairs:
        heatmap(x,y)

heatmap_important()
