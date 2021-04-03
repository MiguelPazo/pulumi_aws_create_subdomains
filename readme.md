# Description
This project create SSL certificates for domains registered in Route53.

##### 1. Set enviroment variables for AWS:
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

##### 2. Create config file in %userprofile%/.aws
Check this guide:

```
https://www.pulumi.com/docs/intro/cloud-providers/aws/setup/
```

##### 3. Set PULUMI_ACCESS_TOKEN for pulumi
```
export PULUMI_ACCESS_TOKEN=
```

Check this guides:
```
https://www.pulumi.com/docs/reference/cli/pulumi_login/
https://www.pulumi.com/docs/guides/continuous-delivery/troubleshooting-guide/#pulumi-access-token
```

##### 4. Create stack
For deploy this infrastructure, you need to init pulumi stack first with this command:

```
pulumi stack init dev
```

If you have several stacks and want to select specific one, run this command:

```
pulumi stack select dev
```

##### 5. Set config variables
```
pulumi config set aws:profile profile
pulumi config set aws:region us-east-1
pulumi config set generalTagName demo
pulumi config set targetDomain domain.com
```

| Variable       | Description                                                            |
|----------------|------------------------------------------------------------------------|
| aws:profile    | profile created in step 2.                                             |
| generalTagName | tag for all resoruces.                                                 |
| targetDomain   | root domain for create subdomains, this should be register in Route53. |

##### 6. Run script
```
pulumi up 
```

If you want to run this without confirmation prompt, run this script:
```
pulumi up --yes 
```

