+++
date = "2017-05-11T14:07:03-07:00"
title = "Glove Embeddings in Keras"

+++
<h1>Glove Embeddings in Keras</h1>
When working on a spam text classification model, (article on this will be published next week) I decided to use a pre-trained GloVe embedding to avoid the huge cost of training your own embedding.  I felt that this task could be made much easier than it currently is and decided to create a python module to make creating Keras GloVe embedding layers simple.

<h2>Background</h2>
GloVe stands for Global Vectors for Word Representation.  On the <a href="https://nlp.stanford.edu/projects/glove/">nlp.standford.edu</a> website, GloVe is described as:</br>
*GloVe is an unsupervised learning algorithm for obtaining vector representations for words. Training is performed on aggregated global word-word co-occurrence statistics from a corpus, and the resulting representations showcase interesting linear substructures of the word vector space.*
In essence, we are trying to obtain a Keras Embedding layer using the weights obtained from using the GloVe algorithm on a huge corpus of text.  Luckily, there are already weights published for embeddings of size 50, 100, 200, and 300 trained on a gigantic corpus of text.  We will use the GloVe embedding trained on Wikipedia 2014 and Gigaword 5.

<h2>Downloading and Caching the Weights</h2>
The download to get the weights for the pre trained GloVe embedding takes a long time.  One of the most important evaluation metrics for a python module is startup time.  If we downloaded the entire weight file zip every time we started the module, we would dramatically the impact startup times for our users' scripts.

This snippet at the start of my package ensures that the GloVe weight files are only downloaded a single time.

<script src="https://gist.github.com/LukeWoodSMU/9a712501c7f6f4f64ad31815c331f2b0.js"></script>

<h2>Loading the Weights and Creating the Embedding Matrix</h2>
Next, we need to transfer the weight values from the file into a dictionary so that we can look up the values of the embedding associated with each word.  Professor Eric Larson from Southern Methodist University wrote a jupyter notebook for his Machine Learning course that showcased an easy way to do this.  I _heavily_ based my code to load the embedding matrix on his.  Here is the code to do this:

<script src="https://gist.github.com/LukeWoodSMU/51dbde3aec6f98a73e6e0deec58e0d8d.js"></script>

Basically, we grab the weights associated with each word and load them in to the weight matrix indexed into the associated location of the 
