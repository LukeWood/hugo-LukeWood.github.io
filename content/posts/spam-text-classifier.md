---
title: Spam Text Classification with RNNs
date: "2017-05-18"
draft: false
type: post
---

### By Justin Ledford, Luke Wood, Traian Pop
___

## Business Understanding

### Data Background
SMS messages play a huge role in a person's life, and the confidentiality and integrity of said messages are of the highest priority to mobile carriers around the world. Due to this fact, many unlawful individuals and groups try and take advantange of the average consumer by flooding their inbox with spam, and while the majority of people successfully avoid it, there are people out there affected negatively by falling for false messages.  

The data we selected is a compilation of 5574 SMS messages acquired from a variety of different sources, broken down in the following way: 452 of the messages came from the Grumbletext Web Site, 3375 of the messages were taken from the NUS SMS Corpus (database with legitimate message from the University of Singapore), 450 messages collected from Caroline Tag's PhD Thesis, and the last 1324 messages were from the SMS Spam Corpus v.0.1 Big.

Overall there were 4827 "ham" messages and 747 "spam" messages, and about 92,000 words.

### Purpose
This data was collected initially for studies on deciphering the differences between a spam or ham (legitimate) messages. Uses for this research can involve advanced spam filtering technology or improved data sets for machine learning programs. However, a slight problem with this data set, as with most localized language-based data sets, is that due to the relatively small area of sampling, there are a lot of regional data points (such as slang, acronyms, etc) that can be considering "useless" data if a much more generalized data set is wanted. For our specific project however, we are keeping all this data in order for us to analyze it and get a better understanding of our data.
___

## Preparation


```python
import pandas as pd
import numpy as np
import requests
import re
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings("ignore")
%matplotlib inline

descriptors_url = 'https://raw.githubusercontent.com/LukeWoodSMU/TextAnalysis/master/data/SMSSpamCollection'
descriptors = requests.get(descriptors_url).text
texts = []


for line in descriptors.splitlines():
    texts.append(line.rstrip().split("\t"))
```

After the first look at the data we noticed a lot of phone numbers. Since almost every number was unique we concluded that the numbers were irrelevant to consider as words. We considered grouping all number tokens into one token and analyze the presence of words, but we decided to first start by just removing the numbers.


```python
# Remove numbers
texts = list(zip([a for a,b in texts], [re.sub('((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d', 'PHONE_NUMBER', b) for a,b in texts]))
```

Citation: regex from google search top results/stack overflow


```python
import numpy as np
import keras
X = [x[1] for x in texts]
y = [x[0] for x in texts]
X = np.array(X)
y = [0 if y_ == "spam" else 1 for y_ in y]
y_ohe = keras.utils.to_categorical(y)
print(y_ohe)
```
<pre class="output">
    array([[ 0.,  1.],
           [ 0.,  1.],
           [ 1.,  0.],
           ...,
           [ 0.,  1.],
           [ 0.,  1.],
           [ 0.,  1.]])
</pre>


We assign spam as a value of 0 and ham as a value of one so that we can use precision score to measure false positive scores.


```python
import keras
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences

NUM_TOP_WORDS = None

tokenizer = Tokenizer(num_words=NUM_TOP_WORDS)
tokenizer.fit_on_texts(X)
word_index = tokenizer.word_index

sequences = tokenizer.texts_to_sequences(X)
sequences = pad_sequences(sequences)

MAX_TEXT_LEN = len(sequences[0]) # maximum and minimum number of words
```

We tokenize and measure the max length of the text using keras' tokenizer.

### Cross Validation Method

We now have an embedding matrix for our word index.

Finally, we split our data into training data and testing data.  We stratify the data on y_ohe to ensure that we get a fair representation of the spam and ham messages.  We believe this to be appropriate because each model needs to see a fair number of both spam messages and ham messages to ensure it does not overtrain on either.


```python
from sklearn.model_selection import train_test_split
# Split it into train / test subsets
X_train, X_test, y_train_ohe, y_test_ohe = train_test_split(sequences, y_ohe, test_size=0.2,
                                                            stratify=y_ohe,
                                                            random_state=42)
NUM_CLASSES = len(y_train_ohe[0])
NUM_CLASSES
```
<pre class="output">
2
</pre>


### Evaluation Metrics
We decided that due to our business understanding being that we can potentially create a spam filter, our largest cost should be false positives.  It would be incredibly frustrating to have a real text filtered out so we should evaluate our models in accordance with this.  To evaluate this, we must implement precision score which has been removed from keras.  Luckily, the old code is available in a one of keras' old versions.


```python
# Old version of keras had precision score, copied the code to re-implement it.
import keras.backend as K
def precision(y_true, y_pred):
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    predicted_positives = K.sum(K.round(K.clip(y_pred, 0, 1)))
    precision = true_positives / (predicted_positives + K.epsilon())
    return precision
```

Citation: old keras version

## Modeling
To avoid the need for training our own embedding layer which is incredibly computationally expensive, we load up a pretrained glove embedding.


```python
EMBED_SIZE = 100
# the embed size should match the file you load glove from
embeddings_index = {}
f = open('GLOVE/glove.6B/glove.6B.100d.txt')
# save key/array pairs of the embeddings
#  the key of the dictionary is the word, the array is the embedding
for line in f:
    values = line.split()
    word = values[0]
    coefs = np.asarray(values[1:], dtype='float32')
    embeddings_index[word] = coefs
f.close()

print('Found %s word vectors.' % len(embeddings_index))
```
<pre class="output">Found 400000 word vectors.</pre>
```python
# now fill in the matrix, using the ordering from the
#  keras word tokenizer from before
embedding_matrix = np.zeros((len(word_index) + 1, EMBED_SIZE))
for word, i in word_index.items():
    embedding_vector = embeddings_index.get(word)
    if embedding_vector is not None:
        # words not found in embedding index will be all-zeros.
        embedding_matrix[i] = embedding_vector

print(embedding_matrix.shape)
```
<pre class="output">(9008, 100)</pre>

```python
from keras.layers import Embedding

embedding_layer = Embedding(len(word_index) + 1,
                            EMBED_SIZE,
                            weights=[embedding_matrix],
                            input_length=MAX_TEXT_LEN,
                            trainable=False)
metrics=[precision,"accuracy"]
```


```python
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM

rnn = Sequential()
rnn.add(embedding_layer)
rnn.add(LSTM(100,dropout=0.2, recurrent_dropout=0.2))
rnn.add(Dense(NUM_CLASSES, activation='sigmoid'))
rnn.compile(loss='categorical_crossentropy',
              optimizer='rmsprop',
              metrics=metrics)
print(rnn.summary())
```
<pre class="output">
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
embedding_1 (Embedding)      (None, 189, 100)          900800    
_________________________________________________________________
lstm_1 (LSTM)                (None, 100)               80400     
_________________________________________________________________
dense_1 (Dense)              (None, 2)                 202       
=================================================================
Total params: 981,402
Trainable params: 80,602
Non-trainable params: 900,800
_________________________________________________________________
None
</pre>


```python
rnn.fit(X_train, y_train_ohe, validation_data=(X_test, y_test_ohe), epochs=3, batch_size=64)
```
<pre class="output">
Train on 4459 samples, validate on 1115 samples
Epoch 1/3
4459/4459 [==============================] - 19s - loss: 0.1908 - precision: 0.9525 - acc: 0.9325 - val_loss: 0.1071 - val_precision: 0.9852 - val_acc: 0.9578
Epoch 2/3
4459/4459 [==============================] - 19s - loss: 0.0982 - precision: 0.9902 - acc: 0.9684 - val_loss: 0.1500 - val_precision: 0.9794 - val_acc: 0.9471
Epoch 3/3
4459/4459 [==============================] - 19s - loss: 0.0742 - precision: 0.9926 - acc: 0.9751 - val_loss: 0.0779 - val_precision: 0.9885 - val_acc: 0.9731
</pre>

### Comparing Different Model Types

To begin, we will evaluate a network using an LSTM cell, a GRU cell, and a SimpleRNN cell.  We will use a standard hyperparameter set to evaluate the results and decide which two architectures we want to explore in depth based on the results.


```python
from keras.layers import LSTM, GRU, SimpleRNN

rnns = []

for func in [SimpleRNN, LSTM, GRU]:
    rnn = Sequential()
    rnn.add(embedding_layer)
    rnn.add(func(100,dropout=0.2, recurrent_dropout=0.2))
    rnn.add(Dense(NUM_CLASSES, activation='sigmoid'))

    rnn.compile(loss='categorical_crossentropy',
                  optimizer='rmsprop',
                  metrics=metrics)
    rnns.append(rnn)
```


```python
for rnn, name in zip(rnns,['simple','lstm','gru']):
    print('\nTesting Cell Type: ',name,'========')
    rnn.fit(X_train, y_train_ohe, epochs=3, batch_size=64, validation_data=(X_test, y_test_ohe))
```

<pre class="output">
    Testing Cell Type:  simple ========
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 7s - loss: 0.2723 - precision: 0.8913 - acc: 0.8924 - val_loss: 0.1902 - val_precision: 0.9341 - val_acc: 0.9318
    Epoch 2/3
    4459/4459 [==============================] - 7s - loss: 0.1705 - precision: 0.9464 - acc: 0.9394 - val_loss: 0.1373 - val_precision: 0.9591 - val_acc: 0.9525
    Epoch 3/3
    4459/4459 [==============================] - 7s - loss: 0.1444 - precision: 0.9565 - acc: 0.9457 - val_loss: 0.1132 - val_precision: 0.9702 - val_acc: 0.9641

    Testing Cell Type:  lstm ========
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 19s - loss: 0.1813 - precision: 0.9784 - acc: 0.9365 - val_loss: 0.1089 - val_precision: 0.9966 - val_acc: 0.9561
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0931 - precision: 0.9958 - acc: 0.9682 - val_loss: 0.0859 - val_precision: 0.9957 - val_acc: 0.9713
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0740 - precision: 0.9958 - acc: 0.9749 - val_loss: 0.0805 - val_precision: 0.9946 - val_acc: 0.9686

    Testing Cell Type:  gru ========
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 19s - loss: 0.2118 - precision: 0.9403 - acc: 0.9141 - val_loss: 0.0982 - val_precision: 0.9931 - val_acc: 0.9695
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0956 - precision: 0.9921 - acc: 0.9699 - val_loss: 0.0729 - val_precision: 0.9939 - val_acc: 0.9749
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0720 - precision: 0.9947 - acc: 0.9771 - val_loss: 0.0668 - val_precision: 0.9950 - val_acc: 0.9758
</pre>

As we can see, the GRU model performs the best by a large margin.  If we continue to train the GRU model it seems that we will get some really great results.  We will try also try to find the best hyperparameters for the GRU model.

After we find the best GRU results we will use an LSTM and then measure the results of the LSTM.

### Gridsearch on GRU Model


```python
dropouts=[.1,.2,.3]
recurrent_dropouts=[.1,.2,.3]

for dropout in dropouts:
    for recurrent_dropout in recurrent_dropouts:
        rnn = Sequential()
        rnn.add(embedding_layer)
        rnn.add(func(100,dropout=dropout, recurrent_dropout=recurrent_dropout))
        rnn.add(Dense(NUM_CLASSES, activation='sigmoid'))

        rnn.compile(loss='categorical_crossentropy',
                      optimizer='rmsprop',
                      metrics=metrics)
        print("Hyper Paramater Set:\n\tdropout=%.1f\n\trecurrent_dropout=%.1f" % (dropout,recurrent_dropout))
        rnn.fit(X_train,y_train_ohe,epochs=3, batch_size=64, validation_data=(X_test,y_test_ohe))
```

<pre class="output">
    Hyper Paramater Set:
    	dropout=0.1
    	recurrent_dropout=0.1
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 19s - loss: 0.2019 - precision: 0.9571 - acc: 0.9186 - val_loss: 0.0949 - val_precision: 0.9967 - val_acc: 0.9668
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0783 - precision: 0.9955 - acc: 0.9715 - val_loss: 0.0870 - val_precision: 0.9937 - val_acc: 0.9677
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0579 - precision: 0.9955 - acc: 0.9818 - val_loss: 0.0671 - val_precision: 0.9938 - val_acc: 0.9758
    Hyper Paramater Set:
    	dropout=0.1
    	recurrent_dropout=0.2
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 20s - loss: 0.1992 - precision: 0.9645 - acc: 0.9258 - val_loss: 0.1475 - val_precision: 0.9853 - val_acc: 0.9507
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0890 - precision: 0.9959 - acc: 0.9711 - val_loss: 0.0786 - val_precision: 0.9957 - val_acc: 0.9713
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0635 - precision: 0.9965 - acc: 0.9798 - val_loss: 0.0646 - val_precision: 0.9958 - val_acc: 0.9776
    Hyper Paramater Set:
    	dropout=0.1
    	recurrent_dropout=0.3
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 20s - loss: 0.2042 - precision: 0.9616 - acc: 0.9285 - val_loss: 0.0963 - val_precision: 0.9939 - val_acc: 0.9650
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0931 - precision: 0.9927 - acc: 0.9695 - val_loss: 0.0827 - val_precision: 0.9969 - val_acc: 0.9722
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0645 - precision: 0.9951 - acc: 0.9787 - val_loss: 0.0673 - val_precision: 0.9950 - val_acc: 0.9785
    Hyper Paramater Set:
    	dropout=0.2
    	recurrent_dropout=0.1
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 19s - loss: 0.1992 - precision: 0.9469 - acc: 0.9273 - val_loss: 0.0970 - val_precision: 0.9943 - val_acc: 0.9695
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0866 - precision: 0.9919 - acc: 0.9715 - val_loss: 0.0823 - val_precision: 0.9931 - val_acc: 0.9704
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0606 - precision: 0.9946 - acc: 0.9814 - val_loss: 0.0660 - val_precision: 0.9933 - val_acc: 0.9776
    Hyper Paramater Set:
    	dropout=0.2
    	recurrent_dropout=0.2
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 20s - loss: 0.2040 - precision: 0.9423 - acc: 0.9206 - val_loss: 0.1004 - val_precision: 0.9920 - val_acc: 0.9632
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0927 - precision: 0.9902 - acc: 0.9704 - val_loss: 0.0780 - val_precision: 0.9950 - val_acc: 0.9740
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0675 - precision: 0.9935 - acc: 0.9782 - val_loss: 0.0660 - val_precision: 0.9932 - val_acc: 0.9794
    Hyper Paramater Set:
    	dropout=0.2
    	recurrent_dropout=0.3
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 20s - loss: 0.2293 - precision: 0.9248 - acc: 0.9065 - val_loss: 0.1219 - val_precision: 0.9816 - val_acc: 0.9561
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.1008 - precision: 0.9860 - acc: 0.9661 - val_loss: 0.0805 - val_precision: 0.9859 - val_acc: 0.9740
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0813 - precision: 0.9886 - acc: 0.9744 - val_loss: 0.0698 - val_precision: 0.9885 - val_acc: 0.9767
    Hyper Paramater Set:
    	dropout=0.3
    	recurrent_dropout=0.1
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 20s - loss: 0.2037 - precision: 0.9509 - acc: 0.9222 - val_loss: 0.1467 - val_precision: 0.9826 - val_acc: 0.9471
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0921 - precision: 0.9910 - acc: 0.9697 - val_loss: 0.0935 - val_precision: 0.9918 - val_acc: 0.9668
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0771 - precision: 0.9942 - acc: 0.9758 - val_loss: 0.0611 - val_precision: 0.9959 - val_acc: 0.9803
    Hyper Paramater Set:
    	dropout=0.3
    	recurrent_dropout=0.2
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 20s - loss: 0.2233 - precision: 0.9236 - acc: 0.9114 - val_loss: 0.1063 - val_precision: 0.9796 - val_acc: 0.9641
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.1017 - precision: 0.9836 - acc: 0.9648 - val_loss: 0.0777 - val_precision: 0.9834 - val_acc: 0.9722
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0765 - precision: 0.9870 - acc: 0.9733 - val_loss: 0.0643 - val_precision: 0.9906 - val_acc: 0.9785
    Hyper Paramater Set:
    	dropout=0.3
    	recurrent_dropout=0.3
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 20s - loss: 0.2367 - precision: 0.9417 - acc: 0.8998 - val_loss: 0.1063 - val_precision: 0.9955 - val_acc: 0.9632
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.1165 - precision: 0.9897 - acc: 0.9628 - val_loss: 0.0787 - val_precision: 0.9969 - val_acc: 0.9722
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0857 - precision: 0.9927 - acc: 0.9717 - val_loss: 0.0883 - val_precision: 0.9950 - val_acc: 0.9677
</pre>


###### We get some pretty ridiculously high accuracy with both of our hyperparameters set to .1

As we can see, with dropout and recurrent dropout at .1 we get some really great results; with accuracy getting as high as 98.6%.  This is ridiculously high.  The model gets .997 precision and .98 accuracy on the validation set with these hyperparameters.

We actually get a similar precision score in a few sets of hyperparameters, but we get a higher accuracy with the .1 and .1 set so this is our most effective model.


```python
best_model = Sequential()
best_model.add(embedding_layer)
best_model.add(GRU(100,dropout=.1, recurrent_dropout=.1))
best_model.add(Dense(NUM_CLASSES, activation='sigmoid'))
best_model.compile(loss='categorical_crossentropy',
                      optimizer='rmsprop',
                      metrics=metrics)
```

### Running Our Best Model With More Epochs


```python
best_model.fit(X_train,y_train_ohe,epochs=10, batch_size=64, validation_data=(X_test,y_test_ohe))
```

<pre class="output">
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/10
    4459/4459 [==============================] - 20s - loss: 0.2039 - precision: 0.9513 - acc: 0.9197 - val_loss: 0.0924 - val_precision: 0.9918 - val_acc: 0.9677
    Epoch 2/10
    4459/4459 [==============================] - 19s - loss: 0.0836 - precision: 0.9930 - acc: 0.9724 - val_loss: 0.0715 - val_precision: 0.9932 - val_acc: 0.9740
    Epoch 3/10
    4459/4459 [==============================] - 19s - loss: 0.0611 - precision: 0.9945 - acc: 0.9800 - val_loss: 0.1282 - val_precision: 0.9846 - val_acc: 0.9552
    Epoch 4/10
    4459/4459 [==============================] - 19s - loss: 0.0507 - precision: 0.9942 - acc: 0.9854 - val_loss: 0.0607 - val_precision: 0.9932 - val_acc: 0.9803
    Epoch 5/10
    4459/4459 [==============================] - 19s - loss: 0.0440 - precision: 0.9959 - acc: 0.9865 - val_loss: 0.0525 - val_precision: 0.9933 - val_acc: 0.9857
    Epoch 6/10
    4459/4459 [==============================] - 19s - loss: 0.0294 - precision: 0.9970 - acc: 0.9924 - val_loss: 0.0623 - val_precision: 0.9917 - val_acc: 0.9839
    Epoch 7/10
    4459/4459 [==============================] - 19s - loss: 0.0280 - precision: 0.9974 - acc: 0.9922 - val_loss: 0.0431 - val_precision: 0.9942 - val_acc: 0.9865
    Epoch 8/10
    4459/4459 [==============================] - 19s - loss: 0.0214 - precision: 0.9986 - acc: 0.9933 - val_loss: 0.0513 - val_precision: 0.9962 - val_acc: 0.9848
    Epoch 9/10
    4459/4459 [==============================] - 19s - loss: 0.0189 - precision: 0.9979 - acc: 0.9957 - val_loss: 0.0443 - val_precision: 0.9935 - val_acc: 0.9883
    Epoch 10/10
    4459/4459 [==============================] - 19s - loss: 0.0132 - precision: 0.9986 - acc: 0.9964 - val_loss: 0.0467 - val_precision: 0.9963 - val_acc: 0.9883
  </pre>


_We end up getting above 99.5% accuracy and a precision score of .9986 on the validation set!  We could absolutely use this to publish a spam filter.  This is a VERY good score on this dataset._

### Grid Search Using LSTM

Now that we know we can get results as high as 99.5% accuracy and 99.8% precision with the GRU network we will try to see how high we can get our LSTM's score.


```python
dropouts=[.1,.2,.3]
recurrent_dropouts=[.1,.2,.3]

for dropout in dropouts:
    for recurrent_dropout in recurrent_dropouts:
        rnn = Sequential()
        rnn.add(embedding_layer)
        rnn.add(LSTM(100,dropout=dropout, recurrent_dropout=recurrent_dropout))
        rnn.add(Dense(NUM_CLASSES, activation='sigmoid'))

        rnn.compile(loss='categorical_crossentropy',
                      optimizer='rmsprop',
                      metrics=metrics)
        print("Hyper Paramater Set:\n\tdropout=%.1f\n\trecurrent_dropout=%.1f" % (dropout,recurrent_dropout))
        rnn.fit(X_train,y_train_ohe,epochs=3, batch_size=64, validation_data=(X_test,y_test_ohe))
```

<pre class="output">
    Hyper Paramater Set:
    	dropout=0.1
    	recurrent_dropout=0.1
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 20s - loss: 0.1763 - precision: 0.9702 - acc: 0.9354 - val_loss: 0.1679 - val_precision: 0.9856 - val_acc: 0.9417
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0878 - precision: 0.9947 - acc: 0.9726 - val_loss: 0.0861 - val_precision: 0.9949 - val_acc: 0.9713
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0679 - precision: 0.9976 - acc: 0.9778 - val_loss: 0.0822 - val_precision: 0.9921 - val_acc: 0.9749
    Hyper Paramater Set:
    	dropout=0.1
    	recurrent_dropout=0.2
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 21s - loss: 0.1810 - precision: 0.9694 - acc: 0.9363 - val_loss: 0.1288 - val_precision: 0.9869 - val_acc: 0.9534
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0921 - precision: 0.9930 - acc: 0.9693 - val_loss: 0.0974 - val_precision: 0.9931 - val_acc: 0.9659
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0737 - precision: 0.9945 - acc: 0.9765 - val_loss: 0.0780 - val_precision: 0.9912 - val_acc: 0.9713
    Hyper Paramater Set:
    	dropout=0.1
    	recurrent_dropout=0.3
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 21s - loss: 0.1841 - precision: 0.9628 - acc: 0.9325 - val_loss: 0.1113 - val_precision: 0.9862 - val_acc: 0.9614
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0970 - precision: 0.9905 - acc: 0.9711 - val_loss: 0.0891 - val_precision: 0.9929 - val_acc: 0.9695
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0752 - precision: 0.9939 - acc: 0.9760 - val_loss: 0.0708 - val_precision: 0.9932 - val_acc: 0.9740
    Hyper Paramater Set:
    	dropout=0.2
    	recurrent_dropout=0.1
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 21s - loss: 0.1779 - precision: 0.9579 - acc: 0.9365 - val_loss: 0.1004 - val_precision: 0.9857 - val_acc: 0.9650
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0956 - precision: 0.9876 - acc: 0.9702 - val_loss: 0.0923 - val_precision: 0.9865 - val_acc: 0.9695
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0719 - precision: 0.9908 - acc: 0.9785 - val_loss: 0.1162 - val_precision: 0.9747 - val_acc: 0.9525
    Hyper Paramater Set:
    	dropout=0.2
    	recurrent_dropout=0.2
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 21s - loss: 0.1794 - precision: 0.9593 - acc: 0.9318 - val_loss: 0.1534 - val_precision: 0.9805 - val_acc: 0.9462
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0928 - precision: 0.9902 - acc: 0.9684 - val_loss: 0.1130 - val_precision: 0.9835 - val_acc: 0.9596
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0789 - precision: 0.9897 - acc: 0.9744 - val_loss: 0.0789 - val_precision: 0.9893 - val_acc: 0.9740
    Hyper Paramater Set:
    	dropout=0.2
    	recurrent_dropout=0.3
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 21s - loss: 0.1878 - precision: 0.9565 - acc: 0.9352 - val_loss: 0.1434 - val_precision: 0.9823 - val_acc: 0.9516
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0992 - precision: 0.9890 - acc: 0.9657 - val_loss: 0.1280 - val_precision: 0.9792 - val_acc: 0.9525
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0827 - precision: 0.9919 - acc: 0.9702 - val_loss: 0.0790 - val_precision: 0.9873 - val_acc: 0.9722
    Hyper Paramater Set:
    	dropout=0.3
    	recurrent_dropout=0.1
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 21s - loss: 0.1891 - precision: 0.9688 - acc: 0.9325 - val_loss: 0.1157 - val_precision: 0.9906 - val_acc: 0.9587
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.0940 - precision: 0.9949 - acc: 0.9713 - val_loss: 0.0992 - val_precision: 0.9921 - val_acc: 0.9650
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0796 - precision: 0.9932 - acc: 0.9724 - val_loss: 0.0767 - val_precision: 0.9921 - val_acc: 0.9740
    Hyper Paramater Set:
    	dropout=0.3
    	recurrent_dropout=0.2
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 21s - loss: 0.1928 - precision: 0.9556 - acc: 0.9289 - val_loss: 0.1007 - val_precision: 0.9891 - val_acc: 0.9623
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.1024 - precision: 0.9899 - acc: 0.9666 - val_loss: 0.0880 - val_precision: 0.9901 - val_acc: 0.9668
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0882 - precision: 0.9905 - acc: 0.9693 - val_loss: 0.0866 - val_precision: 0.9937 - val_acc: 0.9704
    Hyper Paramater Set:
    	dropout=0.3
    	recurrent_dropout=0.3
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 21s - loss: 0.1986 - precision: 0.9723 - acc: 0.9318 - val_loss: 0.1089 - val_precision: 0.9974 - val_acc: 0.9614
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.1016 - precision: 0.9962 - acc: 0.9673 - val_loss: 0.1256 - val_precision: 0.9879 - val_acc: 0.9578
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.0874 - precision: 0.9949 - acc: 0.9706 - val_loss: 0.0956 - val_precision: 0.9929 - val_acc: 0.9668
</pre>

###### As we can see, our best LSTM hyper parameter set is with a dropout of .1 and a recurrent dropout of .2.  We will create this network and train it with more epochs.


```python
best_lstm = Sequential()
best_lstm.add(embedding_layer)
best_lstm.add(LSTM(100,dropout=.1, recurrent_dropout=.2))
best_lstm.add(Dense(NUM_CLASSES, activation='sigmoid'))
best_lstm.compile(loss='categorical_crossentropy',
                      optimizer='rmsprop',
                      metrics=metrics)
```

### Comparison of models


```python
%%time

from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.metrics import confusion_matrix, precision_score

sss = StratifiedShuffleSplit(n_splits=3)

gru_scores = []
gru_cms = []
lstm_scores = []
lstm_cms = []

split_num = 1
for train_index, test_index in sss.split(sequences, y_ohe):
    print('Split #{}'.format(split_num))
    split_num += 1
    X_train, X_test = sequences[train_index], sequences[test_index]
    y_train_ohe, y_test_ohe = y_ohe[train_index], y_ohe[test_index]

    # one hot decode for scoring
    y_test = [list(x).index(1.0) for x in list(y_test_ohe)]

    best_model.fit(X_train,y_train_ohe,epochs=3,
                   batch_size=64,validation_data=(X_train,y_train_ohe),verbose=0)
    y_hat = best_model.predict(X_test)

    # one hot decode for scoring
    y_hat = np.array([[0,1] if np.argmax(x) == 1 else [1,0] for x in y_hat]).astype(float)
    y_hat = [list(x).index(1.0) for x in list(y_hat)]

    gru_scores.append(precision_score(y_test, y_hat))
    gru_cms.append(confusion_matrix(y_test, y_hat))

    print(gru_scores[-1])
    print(gru_cms[-1])

    best_lstm.fit(X_train,y_train_ohe,epochs=3,
                   batch_size=64,validation_data=(X_train,y_train_ohe),verbose=0)
    y_hat = best_lstm.predict(X_test)

    # one hot decode for scoring
    y_hat = np.array([[0,1] if np.argmax(x) == 1 else [1,0] for x in y_hat]).astype(float)
    y_hat = [list(x).index(1.0) for x in list(y_hat)]

    lstm_scores.append(precision_score(y_test, y_hat))
    lstm_cms.append(confusion_matrix(y_test, y_hat))

    print(lstm_scores[-1])
    print(lstm_cms[-1])
```
<pre class="output">
    Split #1
    0.996007984032
    [[ 55   2]
     [  2 499]]
    0.996
    [[ 55   2]
     [  3 498]]
    Split #2
    0.987421383648
    [[ 81   6]
     [  0 471]]
    0.991011235955
    [[ 83   4]
     [ 30 441]]
    Split #3
    0.991786447639
    [[ 71   4]
     [  0 483]]
    0.989733059548
    [[ 70   5]
     [  1 482]]
    CPU times: user 42min 51s, sys: 10min 58s, total: 53min 50s
    Wall time: 20min 33s
</pre>


```python
# Plot bar graphs
bar_width = 0.20
index = np.arange(3)
opacity=0.4

plt.bar(index, gru_scores, bar_width, align='center',
        color='b', label='GRU', alpha=opacity)
plt.bar(index + bar_width, lstm_scores, bar_width,
        align='center', color='r', label='LSTM', alpha=opacity)
plt.title('GRU vs LSTM (precision score)')

plt.legend()
plt.tight_layout()
plt.show()
```


{{< progressive-image class="bordered-figure" src="img/posts/spam-text-classifier/output_46_0.png" >}}

Both models perform extremely well, however the GRU model performed just a bit better.

By looking at heatmaps of the confusion matrices we can get a more granular look into how our models classify each class.


```python
# Plot heatmap
import seaborn as sns
labels = ['Spam', 'Ham']
gru_cm_avg = np.zeros((2,2))
for cm in gru_cms:
    # turn cm into percentages
    totals = np.repeat(np.sum(cm, axis=1), 2, axis=0).reshape(2,2)
    cm_ = cm / totals / 3
    gru_cm_avg = np.sum([gru_cm_avg, cm_], axis=0)

sns.heatmap(gru_cm_avg, annot=True, xticklabels=labels, yticklabels=labels)
plt.title('Heatmap of GRU')
```

{{< progressive-image class="bordered-figure" src="img/posts/spam-text-classifier/output_48_1.png" >}}


```python
# Plot heatmap
lstm_cm_avg = np.zeros((2,2))
for cm in lstm_cms:
    # turn cm into percentages
    totals = np.repeat(np.sum(cm, axis=1), 2, axis=0).reshape(2,2)
    cm_ = cm / totals / 3
    lstm_cm_avg = np.sum([lstm_cm_avg, cm_], axis=0)

sns.heatmap(lstm_cm_avg, annot=True, xticklabels=labels, yticklabels=labels)
plt.title('Heatmap of lstm')
```

{{< progressive-image class="bordered-figure" src="img/posts/spam-text-classifier/output_49_1.png" >}}


From the heatmaps we can see that ham gets classified perfectly using both models, however our GRU model scores much better than the LSTM when classifying spam instances.

## NLTK tokenize vs keras tokenizer

We thought it could be interesting to compare the generalized NLTK tokenizer to the keras tokenizer.  We decided to compare them using basic LSTM networks.

```python
from nltk.tokenize import word_tokenize
X_nltk = [word_tokenize(x) for x in X]
```


```python
encoder = {}
counter = 0
def encode_sentence(seq):
    global encoder, counter
    fseq = []
    for x in seq:
        if x not in encoder:
            encoder[x] = counter
            counter+=1
        fseq.append(encoder[x])
    return fseq

X_nltk = [encode_sentence(x) for x in X]
X_nltk = pad_sequences(X_nltk, maxlen=None)
```


```python
embedding_layer = Embedding(len(word_index) + 1,
                            EMBED_SIZE,
                            weights=[embedding_matrix],
                            input_length=len(X_nltk[0]),
                            trainable=False)
```


```python
rnn = Sequential()
rnn.add(embedding_layer)
rnn.add(LSTM(100,dropout=0.2, recurrent_dropout=0.2))
rnn.add(Dense(NUM_CLASSES, activation='sigmoid'))
rnn.compile(loss='categorical_crossentropy',
              optimizer='rmsprop',
              metrics=metrics)
print(rnn.summary())
```

<pre class="output">
    _________________________________________________________________
    Layer (type)                 Output Shape              Param #   
    =================================================================
    embedding_2 (Embedding)      (None, 910, 100)          900800    
    _________________________________________________________________
    lstm_13 (LSTM)               (None, 100)               80400     
    _________________________________________________________________
    dense_25 (Dense)             (None, 2)                 202       
    =================================================================
    Total params: 981,402
    Trainable params: 80,602
    Non-trainable params: 900,800
    _________________________________________________________________
    None
</pre>

```python
X_train, X_test, y_train_ohe, y_test_ohe = train_test_split(X_nltk, y_ohe, test_size=0.2,
                                                            stratify=y_ohe,
                                                            random_state=42)
```


```python
rnn.fit(X_train, y_train_ohe, validation_data=(X_test, y_test_ohe), epochs=3, batch_size=64)
```

<pre class="output">
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 95s - loss: 0.3282 - precision: 0.8947 - acc: 0.8767 - val_loss: 0.1758 - val_precision: 0.9685 - val_acc: 0.9408
    Epoch 2/3
    4459/4459 [==============================] - 93s - loss: 0.2239 - precision: 0.9454 - acc: 0.9206 - val_loss: 0.2723 - val_precision: 0.9344 - val_acc: 0.9076
    Epoch 3/3
    4459/4459 [==============================] - 93s - loss: 0.1768 - precision: 0.9608 - acc: 0.9477 - val_loss: 0.2153 - val_precision: 0.9479 - val_acc: 0.9471
</pre>


# KerasGlove Published to PyPi
I really liked being able to easily use glove embeddings with keras so I published a package to PyPi for it.  It's available under kerasglove and removes the need for a lot of the code in the notebook.  Here is a sample usage of it:


```python
from kerasglove import GloveEmbedding
EMBED_SIZE=100
metrics = ['accuracy',precision]

embed_layer = GloveEmbedding(
                            EMBED_SIZE,
                            MAX_TEXT_LEN,
                            word_index)
embed_layer
# <keras.layers.embeddings.Embedding at 0x7f901dce3e10>
```


```python
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from kerasglove import GloveEmbedding

rnn = Sequential()
rnn.add(GloveEmbedding(EMBED_SIZE,
                            MAX_TEXT_LEN,
                            word_index))
rnn.add(GRU(100,dropout=0.2, recurrent_dropout=0.2))
rnn.add(Dense(NUM_CLASSES, activation='sigmoid'))
rnn.compile(loss='categorical_crossentropy',
              optimizer='rmsprop',
              metrics=metrics)
print(rnn.summary())
```

<pre class="output">
    _________________________________________________________________
    Layer (type)                 Output Shape              Param #   
    =================================================================
    embedding_4 (Embedding)      (None, 189, 100)          900800    
    _________________________________________________________________
    gru_12 (GRU)                 (None, 100)               60300     
    _________________________________________________________________
    dense_26 (Dense)             (None, 2)                 202       
    =================================================================
    Total params: 961,302
    Trainable params: 60,502
    Non-trainable params: 900,800
    _________________________________________________________________
    None
</pre>


```python
X_train, X_test, y_train_ohe, y_test_ohe = train_test_split(sequences, y_ohe, test_size=0.2,
                                                            stratify=y_ohe,
                                                            random_state=42)
```


```python
rnn.fit(X_train, y_train_ohe, validation_data=(X_test, y_test_ohe), epochs=3, batch_size=64)
```
<pre class="output">
    Train on 4459 samples, validate on 1115 samples
    Epoch 1/3
    4459/4459 [==============================] - 21s - loss: 0.3050 - acc: 0.8872 - precision: 0.8751 - val_loss: 0.2898 - val_acc: 0.8897 - val_precision: 0.9084
    Epoch 2/3
    4459/4459 [==============================] - 19s - loss: 0.2419 - acc: 0.8962 - precision: 0.8936 - val_loss: 0.2526 - val_acc: 0.8933 - val_precision: 0.8888
    Epoch 3/3
    4459/4459 [==============================] - 19s - loss: 0.2360 - acc: 0.9002 - precision: 0.8948 - val_loss: 0.2538 - val_acc: 0.9013 - val_precision: 0.9122
</pre>

As we can see, this is far easier to construct a network with a pre trained GloVe emebedding than doing it manually.

The full source is here:
https://github.com/LukeWoodSMU/KerasGlove
