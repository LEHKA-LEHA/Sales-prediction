import os
import numpy as np
import pandas as pd
import pickle
from flask import Flask, render_template, request, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
from sklearn.ensemble import RandomForestRegressor
import matplotlib.pyplot as plt

app = Flask(__name__)
cors = CORS(app)

@app.route("/input", methods=['POST'])
@cross_origin()
def predict():
    f = request.files['file']
    f.save(secure_filename(f.filename))
    fileName = os.path.abspath(f.filename)
    df = pd.read_csv(fileName)
    if "Date" in df.columns and "SalesPrice" in df.columns:
        df.set_index('Date', inplace=True)
        df['Sale_LastMonth'] = df['SalesPrice'].shift(+1)
        df['Sale_2Monthsback'] = df['SalesPrice'].shift(+2)
        df['Sale_3Monthsback'] = df['SalesPrice'].shift(+3)
        df = df.dropna()
        model = pickle.load(open("Models/RfRegressor", 'rb'))
        x1, x2, x3, y = df['Sale_LastMonth'], df['Sale_2Monthsback'], df['Sale_3Monthsback'], df['SalesPrice']
        x1, x2, x3, y = np.array(x1), np.array(x2), np.array(x3), np.array(y)
        x1, x2, x3, y = x1.reshape(-1, 1), x2.reshape(-1, 1), x3.reshape(-1, 1), y.reshape(-1, 1)
        final_x = np.concatenate((x1, x2, x3), axis=1)
        print(final_x)
        X_train, X_test, y_train, y_test = final_x[:-30], final_x[-30:], y[:-30], y[-30:]
        model.fit(X_train, y_train) 
        pred = model.predict(X_test)
        plt.rcParams["figure.figsize"] = (12, 8)
        plt.plot(pred, label='Forecast')
        plt.plot(y_test, label='Actual Sales')
        plt.legend(loc="upper left")
        plt.show()

        return "Successfully Predicted"
    else:
        return "Your dataset does not contain 'Date' or 'SalesPrice'"

if __name__ == '__main__':
    app.run()
