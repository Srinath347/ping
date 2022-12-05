package com.example.ping;

import com.example.ping.util.Client;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PingApplication {

	public static void main(String[] args) {
		Client.getAllUsers();
		SpringApplication.run(PingApplication.class, args);
	}

}
