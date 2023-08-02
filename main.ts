import { watch } from 'chokidar';
import { readFile, appendFile } from 'fs/promises';
import { config } from 'dotenv';
import axios from 'axios';

function main() {
  config();
  const watcher = watch(process.env.FOLDER_PATH, {
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('add', async (path, _stats) => {
    try {
      const rawMessage = await readFile(path, 'utf-8');
      await axios.post(process.env.SERVER_ENDPOINT, {
        rawMessage
      });
    } catch (err) {
      appendFile('./error.log', JSON.stringify(err) + '\n')
        .then()
        .catch();
    }
  });

  console.log('watcher is running');
}

main();
