/**
 * Created by Miguel Pazo (https://miguelpazo.com)
 */

import * as aws from "@pulumi/aws";
import * as config from "./config";

const subdomains = [
    `www.${config.targetDomain}`,
    `api.${config.targetDomain}`,
];

const zoneSelected = aws.route53.getZone({
    name: config.targetDomain + '.',
    privateZone: false
});

for (let i in subdomains) {
    createSubdomain(subdomains[i], zoneSelected);
}

function createSubdomain(subdomain: string, zone) {
    const subZone = new aws.route53.Zone(subdomain, {
        name: subdomain,
        comment: config.generalTagName,
        tags: {
            Name: `${config.generalTagName}-${subdomain}`,
            [config.generalTagName]: "shared",
        }
    });

    new aws.route53.Record(subdomain, {
        zoneId: zone.then(selected => selected.zoneId),
        name: zone.then(selected => `${subdomain}`),
        type: "NS",
        ttl: 86400,
        records: subZone.nameServers
    });
}
