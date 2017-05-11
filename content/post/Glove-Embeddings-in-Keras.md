+++
date = "2017-05-11T14:07:03-07:00"
title = "Glove Embeddings in Keras"

+++
<h1>Glove Embeddings in Keras</h1>
I was using Keras, my favorite Tensorflow wrapper, and it felt far more difficult than it should be to create an Embedding layer with pre-trained weights.  I felt that this task could be made much easier than it currently is and made a python module specifically for creating GloVe embeddings in keras.

<h2>Background</h2>
GloVe stands for Global Vectors for Word Representation.  GloVe is an unsupervised algorithm that can be run on large corpuses of text to derive weights used for text embeddings.

There are already weights published for embeddings of size 50, 100, 200, and 300 trained on a gigantic corpus of text.  We will use the GloVe embedding trained on Wikipedia 2014 and Gigaword 5.

<h2>Downloading and Caching the Weights</h2>
The download to get the weights for the pre trained GloVe embedding takes a long time.  This snippet at the start of my package ensures that the GloVe weight files are only downloaded a single time.

<script src="https://gist.github.com/LukeWoodSMU/9a712501c7f6f4f64ad31815c331f2b0.js"></script>

<h2>Loading the Weights and Creating the Embedding Matrix</h2>
I needed to transfer the weight values from the file into a dictionary so that we can look up the values of the embedding associated with each word.  Professor Eric Larson from Southern Methodist University wrote a jupyter notebook for his Machine Learning course that showcased an easy way to do this.  Here is a snipped derived from the sample:

<script src="https://gist.github.com/LukeWoodSMU/d9f76bf5d63713e60fef2c4de6651aa2.js"></script>

<h2>Integrating with Keras</h2>
Now that we have the embedding matrix corresponding to our data's word index, we can start integrating with keras.  Luckily, this step was really simple, all I had to do is return a Keras embedding object with the weights overridden by our embedding matrix.  Here is the code that does this.

<script src="https://gist.github.com/LukeWoodSMU/caa8a18b58f8123237bf3ad8e8d7170d.js"></script>

<h2>Publishing to pip and Finalization</h2>
Generalizing this to work with any size embedding was trivial.  I created a function called GloveEmbedding that takes 3 parameters: embedding size, input length, and word index.  After I did this, I published my package on pip.  The package is currently published under kerasglove, give it a try the next time you are creating a Tensorflow recurrent neural network!
