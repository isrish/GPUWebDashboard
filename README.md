# GPUWebDashboard

This is a simple web dashboard application build using Flask and D3.js . The application shows a list of Nvidia GPU devices and there resource usage. 

It is written over a weekend while I was teaching myself data visualization using D3.js library. Along a step learning curve I manage to build there reusable components: a  guage, a thermometer and a radial plot. These component are used to display GPU device memroy usage, temperature and fan speed.

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


