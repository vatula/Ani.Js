#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
import tempfile

output = "../build/Ani.js";
sources_all = [
    "Init.js",
    "AniConstants.js",
    "AniUtil.js",
    "easing/Easing.js",
    "easing/Back.js",
    "easing/Bounce.js",
    "easing/Circ.js",
    "easing/Cubic.js",
    "easing/CustomEasing.js",
    "easing/Elastic.js",
    "easing/Expo.js",
    "easing/Linear.js",
    "easing/Quad.js",
    "easing/Quart.js",
    "easing/Quint.js",
    "easing/Sine.js",
    "AniSequence.js",
    "AniCore.js",
    "Ani.js"
];

def merge(files):
    buffer = []

    for fname in files:
        with open(os.path.join("..", "src", fname), "r") as f:
            buffer.append(f.read())

    return "".join(buffer)

def compress(text):
    in_tuple = tempfile.mkstemp()
    with os.fdopen(in_tuple[0], "w") as handle:
        handle.write(text)

    out_tuple = tempfile.mkstemp()
    os.system("java -jar compiler/compiler.jar --language_in=ECMASCRIPT5_STRICT --js %s --js_output_file %s" % (in_tuple[1], out_tuple[1]))

    with os.fdopen(out_tuple[0], "r") as handle:
        compressed = handle.read()

    os.unlink(in_tuple[1])
    os.unlink(out_tuple[1])

    return compressed

def output(text, filename):
    with open(os.path.join("..", "build", filename), "w") as f:
        f.write(text)

def add_header(text, filename):
    return ("// — %s, http://github.com/vatula/Ani.Js %s" % (filename, os.linesep)) + text

def build_lib(files, filename):
    text = merge(files)

    folder = ""

    print "="*40
    print "Compiling", filename
    print "="*40

    text = compress(text)

    output(add_header(text, filename), folder+filename)

def main(argv=None):
    files = sources_all;
    build_lib(files, "Ani.js")

if __name__ == "__main__":
    main()