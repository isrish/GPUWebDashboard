from flask import Flask
from flask import render_template
import gpustate as gpust

app = Flask(__name__)


@app.route("/")
def index():
	hostname, root  = gpust.encode_tojson(gpust.getgpustate())
	return render_template("index.html", data=root, hostname=hostname)

@app.route("/data")
def getdata():
    hostname, root  = gpust.encode_tojson(gpust.getgpustate())
    return str(len(root)) + " GPU @" + hostname


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, threaded=False, debug=True)
