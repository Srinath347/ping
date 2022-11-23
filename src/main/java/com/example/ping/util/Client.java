package com.example.ping.util;

import com.example.ping.model.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

public class Client {

    static HashMap<Integer, User> userData;

    public static List<User> getAllUsers() {
        if (userData.isEmpty()) {
            initialize();
        }
        return new ArrayList<>(userData.values());
    }

    private static void initialize() {

        System.out.println("Initializing user data");
        userData = new HashMap<>();
        userData.put(1, userBuilder("john", "doe" ));
        userData.put(2, userBuilder("Srinath", "Reddy" ));
        userData.put(3, userBuilder("Sanjana", "Thomas" ));
        userData.put(4, userBuilder("Mathew", "Shejo" ));
        userData.put(5, userBuilder("Aishwarya", "Donekal"));
        System.out.println("user data initialized: " + userData.toString());
    }

    private static User userBuilder(String firstName, String lastName) {
        return User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .isIdle(true)
                .privateKey(getPrivateKey(firstName))
                .publicKey(getSecretKey(lastName))
                .secret(getSecretKey(firstName))
                .build();
    }

    public static List<User> getAllIdleUsers() {
        return userData.values().stream().filter(User::isIdle).collect(Collectors.toList());
    }

    public static void setUserStatus(int id, boolean status) {
        if (!userData.containsKey(id)) {
            System.out.println("User not found");
            return;
        }
        User user = userData.get(id);
        user.setIdle(status);
        userData.put(id, user);
    }

    private static String getPrivateKey(String firstName) {

        switch (firstName) {
            case "Srinath":
            case "Sanjana":
            case "Mathew":
            case "Aishwarya":
            case "John":
            default:
                System.out.println("User not found");
        }
        return "";
    }

    private static String getPublicKey(String firstName) {

        switch (firstName) {
            case "Srinath":
            case "Sanjana":
            case "Mathew":
            case "Aishwarya":
            case "John":
            default:
                System.out.println("User not found");
        }
        return "";
    }

    private static String getSecretKey(String firstName) {
        switch (firstName) {
            case "Srinath":
            case "Sanjana":
            case "Mathew":
            case "Aishwarya":
            case "John":
            default:
                System.out.println("User not found");
        }
        return "";
    }


}
