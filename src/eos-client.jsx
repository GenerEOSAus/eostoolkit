import Eos from 'eosjs'

const EOS_CONFIG = {
  clientConfig: {
    httpEndpoint: 'http://mainnet.genereos.io:80', // EOS http endpoint
    chainId: '579a649aae8f660aa1abbab262437596d1f388f709b0b94a9fd6bba479889ea5'
  }
}

export default function EosClient() {
  return Eos(EOS_CONFIG.clientConfig);
}
