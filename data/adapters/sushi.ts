import { dateToTimestamp } from '../lib/time';
import { query } from '../lib/graph';
import { RegisterFunction, Category } from '../types';
import icon from 'icons/sushi.svg';

async function getSushiswapData(subgraph: string, date: string): Promise<number> {
  const graphQuery = `query fees($date: Int!) {
    dayDatas(where: { date: $date }) {
      volumeUSD
    }
  }`;

  const data = await query(
    subgraph,
    graphQuery,
    {
      date: dateToTimestamp(date),
    },
    'fees'
  );

  if (data.dayDatas.length === 0) {
    throw new Error(`No Sushi data found on ${date} form ${subgraph}`);
  }

  const oneDay = parseFloat(data.dayDatas[0].volumeUSD) * 0.003;

  return oneDay;
}

export default function registerSushiswap(register: RegisterFunction) {
  const createQueryFn = (subgraph: string) => (attribute: string, date: string) => {
    if (attribute !== 'fee') {
      throw new Error(`SushiSwap doesn't support ${attribute}`);
    }
    return getSushiswapData(subgraph, date);
  };

  const metadata = {
    category: 'dex' as Category,
    name: 'SushiSwap',
    subtitle: 'Ethereum',
    bundle: 'sushi',
    description: 'SushiSwap is a community-owned permissionless, decentralized exchange',
    feeDescription: 'Trading fees are paid by traders to liquidity providers and SUSHI stakers',
    source: 'The Graph Protocol',
    adapter: 'sushi',
    tokenTicker: 'SUSHI',
    tokenCoingecko: 'sushi',
    website: 'https://sushi.com',
    icon,
  };

  register('sushiswap', createQueryFn('sushiswap/exchange'), {
    ...metadata,
    name: 'SushiSwap',
    blockchain: 'Ethereum',
    protocolLaunch: '2020-09-09',
  });

  register('sushiswap-polygon', createQueryFn('sushiswap/matic-exchange'), {
    ...metadata,
    name: 'SushiSwap (Polygon)',
    blockchain: 'Polygon',
    protocolLaunch: '2021-02-26',
  });

  register('sushiswap-fantom', createQueryFn('sushiswap/fantom-exchange'), {
    ...metadata,
    name: 'SushiSwap (Fantom)',
    blockchain: 'Fantom',
    protocolLaunch: '2021-02-26',
  });

  register.bundle('sushi', {
    icon,
    name: 'SushiSwap',
    category: 'dex',
    adapter: 'sushi',
    protocolLaunch: '2020-09-09',
  });
}
