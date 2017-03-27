import sys
import os

sys.path.append(os.path.abspath('..'))

from analysis import histogram_analysis

data,poison_data = histogram_analysis.get_hist_data()

tf_tpf = {}

for val in data:
    tf_tpf[val] = dict([(x,poison_data[val][x]/data[val][x]) for x in data[val] if data[val][x] != 0])

import numpy as np
import matplotlib.pyplot as plt

for key in tf_tpf:
    all_corrs = []
    for x in tf_tpf[key]:
        all_corrs.append((x,tf_tpf[key][x]))

    all_corrs = sorted(all_corrs, key=lambda x: x[1])
    bar_width = 0.5

    fig = plt.figure()

    plt.title('%s'%(key))

    rects1 = plt.bar(np.arange(len(all_corrs))+bar_width ,[x[1] for x in all_corrs],bar_width)
    plt.ylabel("Percentage of Poisonous Occurrences")
    plt.xlabel("Attribute Name")
    plt.xticks(np.arange(len(all_corrs))+bar_width*3/2, [x[0] for x in all_corrs])

    x1,x2,y1,y2 = plt.axis()
    plt.axis((x1,x2,0.0,1.0))

    plt.savefig('barcharts/%s.png' % (key), dpi=fig.dpi)
