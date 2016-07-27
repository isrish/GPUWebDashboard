import nvidia_smi
from lxml import objectify
import os
from lxml import etree
import re

def getgpustate():
    x = nvidia_smi.XmlDeviceQuery()
    tree = objectify.fromstring(x)
    #print(etree.tostring(tree, pretty_print=True))
    return tree

def encode_tojson(tree):
    num_gpu = len(tree.gpu)
    ret = []
    for i in range(num_gpu):
        struct = {}
        struct['Name'] = str(tree.gpu[i].product_name)
        struct['GPUid'] = 'gpu' + str(i)
        struct['MemoryTotal'] = re.sub('[^0-9]', '', str(tree.gpu[i].fb_memory_usage.total))
        struct['MemoryUsed'] = re.sub('[^0-9]', '', str(tree.gpu[i].fb_memory_usage.used))
        struct['Temperature'] = re.sub('[^0-9]', '', str(tree.gpu[i].temperature.gpu_temp))
        struct['FanSpeed'] = re.sub('[^0-9]', '', str(tree.gpu[i].fan_speed))
        struct['PerformanceState'] = str(tree.gpu[i].performance_state)
        struct['Process'] = []
        struct['NumProcess'] = 0
        if str(tree.gpu[i].processes) != "N/A" and tree.gpu[i].find('.//process_info') is not None:
            #print(etree.tostring(tree.gpu[i].processes,pretty_print=True))
            num_prc = len(tree.gpu[i].processes.process_info)
            for j in range(num_prc):
                proc_dic = {}
                proc_dic['PID'] = re.sub('[^0-9]', '', str(tree.gpu[i].processes.process_info[j].pid))
                proc_dic['Process Name'] = str(tree.gpu[i].processes.process_info[j].process_name)
                proc_dic['Memory Used'] = str(tree.gpu[i].processes.process_info[j].used_memory)
                struct['Process'].append(proc_dic)
            struct['NumProcess'] = num_prc
        ret.append(struct)
    return os.uname()[1], ret


if __name__ == "__main__":
    gpus = encode_tojson(getgpustate())
    for gpu in gpus:
        print gpu
        print len(gpu['Process'])
