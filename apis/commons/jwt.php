<?php
class JWT
{
      private static $secretKey = "934e58bb6e255089bc24412c63132934";

      public static function encode($data, $expirationTime = 3600)
      {
            $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
            $payload = base64_encode(json_encode([
                  'iss' => 'xpense-manager',
                  'aud' => 'xpense-manager-users',
                  'iat' => time(),
                  'nbf' => time(),
                  'exp' => time() + $expirationTime,
                  'data' => $data,
            ]));
            $signature = base64_encode(hash_hmac('sha256', "$header.$payload", self::$secretKey, true));
            return "$header.$payload.$signature";
      }

      public static function decode($token)
      {
            list($header, $payload, $signature) = explode('.', $token);
            $expectedSignature = base64_encode(hash_hmac('sha256', "$header.$payload", self::$secretKey, true));
            $header = json_decode(base64_decode($header), true);
            $payload = json_decode(base64_decode($payload), true);
            return ($signature == $expectedSignature) ? $payload : false;
      }
}
