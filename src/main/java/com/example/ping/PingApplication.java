package com.example.ping;

import com.example.ping.util.Client;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.FileOutputStream;
import java.security.*;

@SpringBootApplication
public class PingApplication {

	public static void main(String[] args) {
		Client.getAllUsers();
//		keyGeneration();
		SpringApplication.run(PingApplication.class, args);
	}

	private static void keyGeneration() throws Exception {
		String publicKeyFilePath = "/Users/srinath/Desktop/ping/keys/srinath.key";
		String privateKeyFilePath = "/Users/srinath/Desktop/srinath.key";
		KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
		generator.initialize(2048);
		KeyPair pair = generator.generateKeyPair();
		PublicKey publicKey = pair.getPublic();
		try (FileOutputStream fos = new FileOutputStream(publicKeyFilePath)) {
			fos.write(publicKey.getEncoded());
		}
		PrivateKey privateKey = pair.getPrivate();
		try (FileOutputStream fos = new FileOutputStream(privateKeyFilePath)) {
			fos.write(privateKey.getEncoded());
		}
	}

}
