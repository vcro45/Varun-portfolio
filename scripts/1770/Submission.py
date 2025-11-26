
import numpy as np
from tensorflow.keras.datasets import fashion_mnist

# Load Fashion-MNIST
(x_train, y_train), (x_test, y_test) = fashion_mnist.load_data()

# Normalize pixel values to [0, 1]
x_train = x_train.astype("float32") / 255.0
x_test = x_test.astype("float32") / 255.0

# Reshape for CNN input (28,28,1)
x_train = np.expand_dims(x_train, axis=-1)
x_test = np.expand_dims(x_test, axis=-1)

# Validation split: last 12,000 samples
x_val = x_train[-12000:]
y_val = y_train[-12000:]

# Remaining 48,000 samples for training
x_train = x_train[:48000]
y_train = y_train[:48000]

print("Train shape:", x_train.shape)
print("Validation shape:", x_val.shape)
print("Test shape:", x_test.shape)