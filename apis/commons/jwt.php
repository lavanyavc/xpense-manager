<?php
class JWT
{
      private static $secretKey = "934e58bb6e255089bc24412c63132934";

      public static function encode($data, $expirationTime = 3600)
      {
            $header = base64_encode(json_encode(['type' => 'JWT', 'algo' => 'SHA256']));
            $payload = base64_encode(json_encode([
                  'iss' => 'xpense-manager',
                  'aud' => 'xpense-manager-web',
                  'iat' => time(),
                  'nbf' => time() + 1, // Not Before 1 second from now
                  'exp' => time() + $expirationTime,
                  'data' => $data,
            ]));
            $signature = hash_hmac('sha256', "$header.$payload", self::$secretKey, true);
            $signature = base64_encode($signature);
            return "$header.$payload.$signature";
      }

      public static function decode($token)
      {
            list($header, $payload, $signature) = explode('.', $token);
            $expectedSignature = base64_encode(hash_hmac('sha256', "$header.$payload", self::$secretKey, true));
            $header = json_decode(base64_decode($header), true);
            $payload = json_decode(base64_decode($payload), true);
            return hash_equals($signature, $expectedSignature) ? $payload : false;
      }
}
