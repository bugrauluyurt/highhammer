#!/bin/bash

getOciNodePortUrl() {
  nodePort="$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services zot)"
  nodeIp="$(kubectl get nodes --namespace default -o jsonpath="{.items[0].status.addresses[0].address}")"

  export OCI_NODE_PORT=$nodePort
  export OCI_NODE_IP=$nodeIp
  echo "http://$OCI_NODE_IP:$OCI_NODE_PORT"
}

getOciNodePortUrl


