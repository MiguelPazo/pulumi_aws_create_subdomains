/**
 * Created by Miguel Pazo (https://miguelpazo.com)
 */
import * as aws from "@pulumi/aws";
import * as config from "./config";

let subdomains = [];
let subdomainsProduction = [];

switch (config.stack) {
    case 'app1':
        subdomains.push(`auth-dev.${config.targetDomain}`);
        subdomains.push(`auth2-dev.${config.targetDomain}`);
        subdomains.push(`auth-qa.${config.targetDomain}`);

        // example to create domain for production
        // subdomainsProduction.push(`auth.${config.targetDomainProduction}`);
        // subdomainsProduction.push(`auth-api.${config.targetDomainProduction}`);
        break;

    case 'app2':
        subdomains.push(`payment-dev.${config.targetDomain}`);
        subdomains.push(`payment-qa.${config.targetDomain}`);

        // example to create domain for production
        // subdomainsProduction.push(`payment.${config.targetDomainProduction}`);
        // subdomainsProduction.push(`payment-api.${config.targetDomainProduction}`);
        break;
}

const zoneSelected = aws.route53.getZone({
    name: config.targetDomain + '.',
    privateZone: false
});

for (let i in subdomains) {
    createSubdomain(subdomains[i], zoneSelected);
}

if (config.targetDomainProduction) {
    const zoneSelectedProduction = aws.route53.getZone({
        name: config.targetDomainProduction + '.',
        privateZone: false
    });

    for (let i in subdomainsProduction) {
        createSubdomain(subdomainsProduction[i], zoneSelectedProduction);
    }
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
        ttl: 172800,
        records: subZone.nameServers
    });
}
