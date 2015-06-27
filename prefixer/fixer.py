filename = "test.html"
outdir = ".."

fd = open(filename)
strlist = []


for line in fd:
    nline = line.strip()
    
    if nline.find("transform") == 0:
        tab = line[0:line.index("transform")]
        strlist.append(tab + "-webkit-" + nline + " ")
        #strlist.append("-moz-" + nline + " ")
        #strlist.append("-ms-" + nline + " ")
        #strlist.append("-o-" + nline + " ")
        strlist.append(nline + "\n")
    elif nline.find("animation") == 0:
        tab = line[0:line.index("animation")]
        strlist.append(tab + "-webkit-" + nline + " ")
        #strlist.append("-moz-" + nline + " ")
        #strlist.append("-ms-" + nline + " ")
        #strlist.append("-o-" + nline + " ")
        strlist.append(nline + "\n")
    else:
        strlist.append(line)
fd.close()


state = 0
for i in range(len(strlist)):
    line = strlist[i]
    nline = line.strip()
    if (nline.find("@keyframes") == 0 and state == 0):
        tab = line[0: line.index("@keyframes")].replace("\t", "    ")
        state = 1
        startindex = i
    elif (line.replace("\t", "    ").find("}") == len(tab) and state == 1):
        state = 0
        endindex = i
        b = strlist[startindex : endindex+1]
        b[0] = b[0].replace("@", "@-webkit-")
        a = "".join(b)
        strlist.insert(endindex+1, a)





nfd = open(outdir + "/" + filename, "w")
nfd.write("".join(strlist))
nfd.close()