import Eos from 'eosjs'

const EOS_CONFIG = {
  clientConfig: {
    httpEndpoint: 'http://dev.cryptolions.io:38888', // EOS http endpoint
    chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'
  }
}

export default function EosClient() {
  return Eos(EOS_CONFIG.clientConfig);
}
