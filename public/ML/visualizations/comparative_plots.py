import sys
import os
import numpy as np
import matplotlib.pyplot as plt

sys.path.append(os.path.abspath('..'))
from preprocessing import shroom_dealer


def data(attribute):
    df = shroom_dealer.get_data_frame()
    attribute_values = shroom_dealer.get_attribute_dictionary()[attribute]

    poisonous_data = {}
    edible_data = {}

    for a in attribute_values.keys():
        poisonous_data[a] = \
                df[attribute][df['poisonous'] == 'p'][df[attribute] == a].count()
        edible_data[a] = \
                df[attribute][df['poisonous'] == 'e'][df[attribute] == a].count()

    return {"poisonous": poisonous_data, "edible": edible_data}


def plot_comparative_data(attribute, plot=True, save=False):
    edible_data = data(attribute)["edible"]
    poisonous_data = data(attribute)["poisonous"]

    labels = shroom_dealer.get_attribute_dictionary()[attribute]

    index = np.arange(len(edible_data))
    bar_width = 0.35
    opacity=0.4

    fig, ax = plt.subplots()

    plt.bar(index, edible_data.values(), bar_width, align='center',
            color='b', label='edible', alpha=opacity)
    plt.bar(index + bar_width, poisonous_data.values(), bar_width,
            align='center', color='r', label='poisonous', alpha=opacity)

    plt.xlabel('Attributes')
    plt.ylabel('Frequency')
    plt.title('Frequency by attribute and edibility ({})'.format(attribute))
    plt.xticks(index + bar_width / 2,
               [labels[key] for key in edible_data.keys()])

    plt.legend()

    plt.tight_layout()

    if plot:
        plt.show()

    if save:
        plt.savefig('comparative_barcharts/{}.png'.format(attribute))

    plt.close()


def plot_all():
    attributes = shroom_dealer.get_attribute_dictionary()
    for a in attributes.keys():
        plot_comparative_data(a, plot=True)


def save_all():
    attributes = shroom_dealer.get_attribute_dictionary()
    for a in attributes.keys():
        plot_comparative_data(a, plot=False, save=True)
