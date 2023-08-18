/*****
 * RSA加密解密工具类
 * **/
import { JSEncrypt } from 'jsencrypt' // 导入
// 公钥
let publicKey = ''
// 私钥
let privateKey = ''

export function set_PublicKey (PublicKey) {
  publicKey = PublicKey
}

export function set_PrivateKey (PrivateKey) {
  privateKey = PrivateKey
}

// 加密
export function encrypt (txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt (txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}
