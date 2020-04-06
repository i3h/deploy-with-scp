# GitHub Action - Deploy with SCP

This GitHub Action wraps scp command with ssh jump option.

# Usage

```
- name: Deploy with SCP
  id: deploy_with_scp
  uses: noobly314/deploy-with-scp
  with:
    src: /path/to/source
    dest: /path/to/destination
    username: ${{ secrets.SERVER_USER }}
    server-ip: ${{ secrets.SERVER_IP }}
    ssh-key: ${{ secrets.SERVER_SSH_KEY }}
    proxy-username: ${{ secrets.PROXY_SERVER_USER }}
    proxy-server-ip: ${{ secrets.PROXY_SERVER_IP }}
    proxy-ssh-key: ${{ secrets.PROXY_SERVER_SSH_KEY }}

// Parameters with prefix 'proxy' are optional.
```
