export interface Node {
    name: string;
    type: string;
    group: string;
    mgmtIpv4?: string;
    startupConfig?: string;
    binds?: string[];
    exec?: string[];
    image?: string;
    cmd?: string;
    ports?: number[];
    env?: Record<string, string>;
  }
  
  export interface Link {
    source: string;
    target: string;
  }
  
  export interface D3Data {
    nodes: Node[];
    links: Link[];
  }