from flask import Flask, render_template, request
import MySQLdb, numpy, json, datetime, csv, math, codecs,sys, hashlib

reload(sys)
sys.setdefaultencoding('utf-8')

app = Flask(__name__)

def datetime_handler(x):
    if isinstance(x, datetime.datetime):
        return x.isoformat()
    raise TypeError("Unknown type")

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/susi")
def index():
    return render_template('susi.html')

if __name__ == "__main__":
    #app.run(debug=True, use_reloader=True)
    app.run(host='37.114.85.124', port=80, debug=True, use_reloader=True)
