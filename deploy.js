import { NodeSSH } from 'node-ssh';
import { exec } from 'child_process';
import util from 'util';

const ssh = new NodeSSH();
const asyncExec = util.promisify(exec);

const remotePath = '/opt/static/intl-test';

async function buildProject() {
    console.log('开始打包项目...');
    // 如果你用 yarn 就改成 yarn build
    await asyncExec('yarn build');
    console.log('项目打包完成');
}

async function deploy() {
    try {
        await buildProject();
        await ssh.connect({
            host: '39.104.79.0',
            username: 'root',
            password: 'SpeedPower3722'
        });

        console.log('连接成功');
        await ssh.execCommand(`rm -rf ${remotePath}/order_copy`);
        console.log('🗑️ 删除旧的备份完成');

        // 将 group 和 agent 改名为 *_copy
        await ssh.execCommand(`mv ${remotePath}/order ${remotePath}/order_copy || true`);

        await ssh.execCommand(`rm -rf ${remotePath}/order`);
        console.log('删除旧文件完成');

        await ssh.putDirectory('build', remotePath, {
            recursive: true,
            concurrency: 5
        });
        console.log('项目上传成功!');
        ssh.dispose();
    } catch (error) {
        console.error('部署失败:', error);
    }
}

deploy().catch(console.error);
