#!/usr/bin/env python
# -*- coding: utf-8 -*-

import urllib
import json
import os

from flask import Flask
from flask import request
from flask import make_response

from sqlalchemy.orm import sessionmaker

# from OpenSSL import SSL

app = Flask("susi_service")


@app.route('/webhook', methods=['POST'])
def webhook():
    req = request.get_json(silent=True, force=True)

    print("Request:")
    print(json.dumps(req, indent=4))

    res = makeWebhookResult(req)

    res = json.dumps(res, indent=4)
    print(res)
    r = make_response(res)
    r.headers['Content-Type'] = 'application/json'
    return r

def makeWebhookResult(req):
    if req.get("result").get("action") != "susi.municipio":
        return {}
    result = req.get("result")
    parameters = result.get("parameters")
    municipio = parameters.get("municipio")

    Base.metadata.bind = engine
    DBSession = sessionmaker(bind=engine)
    session = DBSession()
    brain = session.query(Unidades).filter(municipio = municipio).all()

    unidades = ""

    for item in brain:
        unidades += str(item.name) + str(item.endereco)

    speech = "As unidades de saúde do seu municipio são " + unidades

    print("Response:")
    print(speech)

    return {
        "speech": speech,
        "displayText": speech,
        #"data": {},
        # "contextOut": [],
        "source": "apiai-onlinestore-shipping"
    }


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))

    print("Starting app on port %d" % port)
    
    # context = SSL.Context(SSL.SSLv23_METHOD)
    # context.use_privatekey_file('ssl_server.key')
    # context.use_certificate_file('ssl_server.crt')

    # app.run(debug=True, port=port, host='0.0.0.0', ssl_context=context)
    app.run(debug=True, port=port, host='0.0.0.0')