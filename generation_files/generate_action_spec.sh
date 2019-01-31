java -jar /Users/lknecht/Repositories/openapi-generator/modules/openapi-generator-cli/target/openapi-generator-cli.jar generate \
     --input-spec ~/Repositories/splunk-cloud-sdk-js/generation_files/spec_files/logan_action-v4-oa3.yaml \
     --generator-name typescript-fetch \
     --output ~/Repositories/splunk-cloud-sdk-js/generated_api/action \
     --template-dir ~/Repositories/splunk-cloud-sdk-js/generation_files/templates/typescript-fetch

# java -jar /Users/lknecht/Repositories/openapi-generator/modules/openapi-generator-cli/target/openapi-generator-cli.jar generate \
#      --input-spec ~/Repositories/splunk-cloud-sdk-js/generation_files/spec_files/logan_action-v2-oa3.yaml \
#      --generator-name typescript-fetch \
#      --template-dir ~/Repositories/splunk-cloud-sdk-js/generation_files/templates/typescript-fetch \
#      --output ~/Repositories/splunk-cloud-sdk-js/generated_api/action