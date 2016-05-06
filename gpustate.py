import nvidia_smi
from lxml import objectify
import re

def getgpustate():
	x = nvidia_smi.XmlDeviceQuery()
	tree = objectify.fromstring(x)
	return tree
def encode_tojson(tree):
	num_gpu =  len(tree.gpu)
	ret = [];
	for i in range(num_gpu):
		struct = {}
		struct['Name']= str(tree.gpu[i].product_name)
		struct['GPUid'] = 'gpu'+ str(i)
		struct['MemoryTotal'] =  re.sub('[^0-9]','', str(tree.gpu[i].fb_memory_usage.total))
		struct['MemoryUsed'] =  re.sub('[^0-9]','', str(tree.gpu[i].fb_memory_usage.used))
		struct['Temperature'] = re.sub('[^0-9]','', str(tree.gpu[i].temperature.gpu_temp))
		struct['FanSpeed'] = re.sub('[^0-9]','',str(tree.gpu[i].fan_speed))
		struct['PerformanceState'] = str(tree.gpu[i].performance_state)
		ret.append(struct)
	return ret

if __name__ == "__main__":
	gpus  = encode_tojson(getgpustate())
	for gpu in gpus:
		print  gpu['Name']
