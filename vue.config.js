const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
- name: Manually Install Maven
  run: |
    curl -fsSL https://dlcdn.apache.org/maven/maven-3/3.8.8/binaries/apache-maven-3.8.8-bin.tar.gz -o maven.tar.gz
    tar -xzf maven.tar.gz
    mv apache-maven-3.8.8 $HOME/maven
    echo "$HOME/maven/bin" >> $GITHUB_PATH