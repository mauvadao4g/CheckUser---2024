const http = require('http');
const { exec } = require('child_process');
const config = require('./config.json');

const server = http.createServer(async (req, res) => {

    let path_route = req.url.split('/')[1]
    if (path_route !== 'check') {
      return res.end('Cannot get ' + req.url)
    }

    let username = req.url.split('/')[2].split('?')[0]
    if (!username) {
      return res.end('Param username pending')
    }

    let count_connections, limit_connections, expiration_date, expiration_days
    const get_count_connections = new Promise((resolver) => {
        exec(
          'ps -u ' + username + ' | grep sshd | wc -l',
          (error, stdout, stderr) => {
            if (error) {
              count_connections = 0
            }
            if (stderr) {
              count_connections = 0
            }
            resolver(parseInt(stdout?.trim().replace('\n', '') || 0))
          }
        )
      }),
      get_limit_connections = new Promise((resolver) => {
        exec(
          'grep "^' + username + ' " "/root/usuarios.db" | cut -d\' \' -f2',
          (error, stdout, stderr) => {
            if (error) {
              connection_limit = 0
            }
            if (stderr) {
              connection_limit = 0
            }
            resolver(parseInt(stdout?.trim().replace('\n', '') || 0))
          }
        )
      }),
      get_expiration_date = new Promise((_0x2924dc) => {
        exec(
          'clear\nusuario="' +
            username +
            '"\ndatauser=$(chage -l $usuario | grep -i co | awk -F : \'{print $2}\')\ndatabr="$(date -d "$datauser" +"%Y%m%d")"\nhoje="$(date -d today +"%Y%m%d")"\nif [ $hoje -ge $databr ]; then\ndata="-1"\nelse\ndat="$(date -d"$datauser" \'+%Y-%m-%d\')"\ndata=$(date -d "$dat" +"%d/%m/%Y")\nfi\necho -e "$data"',
          (_0x120b3b, _0x5c3481, _0xb5c767) => {
            if (_0x120b3b) {
              expiration_date = '00/00/0000'
            }
            if (_0xb5c767) {
              expiration_date = '00/00/0000'
            }
            const _0x23b665 = _0x5c3481,
              _0x373caf = _0x23b665.match(/(\d{2}\/\d{2}\/\d{4})/),
              _0x4b6101 = _0x373caf ? _0x373caf[1] : null
            _0x2924dc(_0x4b6101?.trim().replace('\n', '') || '00/00/0000')
          }
        )
      }),
      get_expiration_days = new Promise((_0x550712) => {
        exec(
          'clear\nusuario="' +
            username +
            '"\ndatauser=$(chage -l $usuario |grep -i co |awk -F : \'{print $2}\')\nif [ $datauser = never ] 2> /dev/null\nthen\ndata="-1"\nelse\ndatabr="$(date -d "$datauser" +"%Y%m%d")"\nhoje="$(date -d today +"%Y%m%d")"\nif [ $hoje -ge $databr ]\nthen\ndata="-1"\nelse\ndat="$(date -d"$datauser" \'+%Y-%m-%d\')"\ndata=$(echo -e "$((($(date -ud $dat +%s)-$(date -ud $(date +%Y-%m-%d) +%s))/86400))")\nfi\nfi\necho -e "$data"',
          (_0x4c2d68, _0xe20fd8, _0x292a36) => {
            if (_0x4c2d68) {
              expiration_days = 0
            }
            if (_0x292a36) {
              expiration_days = 0
            }
            const _0x50458f = _0xe20fd8,
              _0x271c52 = _0x50458f.match(/-e (\d+)/),
              _0x364d93 = _0x271c52 ? parseInt(_0x271c52[1]) : null
            _0x550712(_0x364d93 || 0)
          }
        )
      })
    count_connections = await get_count_connections
    limit_connections = await get_limit_connections
    expiration_date = await get_expiration_date
    expiration_days = await get_expiration_days
    res.end(
      JSON.stringify({
        username: username,
        limit_connections: limit_connections,
        count_connections: count_connections,
        expiration_date: expiration_date,
        expiration_days: expiration_days,
      })
    )
  })
try {
  server.listen(config.listen_port)
} catch (err) {
  console.log('A porta ' + config.listen_port + ' está em uso.')
}