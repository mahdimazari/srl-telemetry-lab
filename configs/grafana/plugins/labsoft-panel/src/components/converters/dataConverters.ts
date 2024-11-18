// import clab from '../../../../../../../st.clab.json';
// import * as fs from 'fs';
import YAML from 'yaml';

      export function convertYamlToJson(yamlString) {
        try {
          const jsonData = YAML.parse(yamlString);
          console.log("JSON data:", jsonData);
          return jsonData;
        } catch (e) {
          console.error("Error parsing YAML:", e);
          return null;
        }
        
      }


    export async function fetchPrometheusData(query: string): Promise<any> {
        const url = `http://localhost:9090/api/v1/query?query=${encodeURIComponent(query)}`;
    // console.log('url', `http://localhost:9090/api/v1/query?query=${encodeURIComponent(query)}` );
        const response = await fetch(url);
        const data = await response.json();
      
        if (data.status !== "success") {
          throw new Error("Failed to fetch data from Prometheus");
        }
      
        return data.data.result;
      }


      export function transformPrometheusData(prometheusData: any): { nodes: any[]; links: any[] } {
        const nodes: any[] = [];
        const links: any[] = [];
      
        prometheusData.forEach((entry: any) => {
          const source = entry.metric.source;
          const interfaceName = entry.metric.interface_name;
          const value = parseFloat(entry.value[1]); // Prometheus returns [timestamp, value]
      
          // Add the source node if it doesn't exist
          if (!nodes.find((node) => node.id === source)) {
            nodes.push({ id: source });
          }
      
          // Add a link with traffic rate as the weight
          links.push({
            source: source,
            interface: interfaceName.replace("ethernet-", "e").replace("/", "-"), // Use interface name or another node ID if available
            value: value
          });
        });
      
        return { nodes, links };
      }


            // Fonction pour créer les nodes
      export function createNodes(containers: any[]): any[] {
          return containers.map((container) => ({
            id: container.name,
            ipv4: container.ipv4_address,
            type: container.group,
          }));
        }
        
      // Fonction pour créer les links
      export function createLinks(metrics: any[]): any[] {
        const links: any[] = [];
      
        metrics.forEach((metric) => {
          const { source, interface_name } = metric.metric;
          const trafficRate = parseFloat(metric.value[1]);
      
          links.push({
            source: source,
            target: interface_name,
            trafficRate: trafficRate,
          });
        });
      
        return links;
      }





