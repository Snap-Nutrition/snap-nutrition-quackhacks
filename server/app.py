from flask import *
from macros import get_macros
import openai

app = Flask(__name__)

# https://www.geeksforgeeks.org/how-to-upload-file-in-python-flask/

@app.route('/')   
def main():   
    return render_template("index.html") 

@app.route('/success', methods = ['POST'])   
def success():   
    if request.method == 'POST':   
        f = request.files['file'] 
        result = get_macros(f)
        return Response(result.toJSON(), mimetype='application/json')

if __name__ == '__main__':   
    app.run(debug=True)