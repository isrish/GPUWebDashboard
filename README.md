# GPUWebDashboard

This is a simple web dashboard application build using Flask and D3.js . The application shows a list of Nvidia GPU devices and their resource usage. 

It is written over a weekend while I was teaching myself data visualization using D3.js library. Along a steep learning curve I manage to build three reusable components: guage, thermometer and radial plot. They are used to display GPU device memroy usage, temperature and fan speed.

![](https://raw.githubusercontent.com/isrish/GPUWebDashboard/master/img/screen.png)

# Usage
## Setup
After you download all the source files, first you need to install the required python package
```
$ pip install -r requirements.txt
```
## Running
Running following command  will launch the web application 
```
$ python app.py
```
You can check the dashboard app at <a href="http://localhost:5000">http://localhost:5000</a>. The page automaticaly refresh every 30 seconds.  


