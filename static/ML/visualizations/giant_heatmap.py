import seaborn as sns
import matplotlib.pyplot as plt
import os
import sys

sys.path.append(os.path.abspath('..'))
from analysis.correlated_attributes import get_corr

corr_df = get_corr()

fig, ax = plt.subplots(figsize=(28,28))

sns.heatmap(corr_df)
fig.autofmt_xdate()

locs, labels = plt.yticks()
plt.setp(labels,rotation=30)

locs, labels = plt.xticks()
plt.setp(labels,rotation=60)


plt.savefig("singleton/fullheatmap.png", dpi=fig.dpi)
