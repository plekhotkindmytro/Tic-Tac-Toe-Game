package statistics.controller;

import static spark.Spark.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import spark.ModelAndView;
import spark.template.freemarker.FreeMarkerEngine;
import statistics.dao.TicTacToeDao;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoDatabase;

import freemarker.template.Configuration;

public class App {

	static int getHerokuAssignedPort() {
		ProcessBuilder processBuilder = new ProcessBuilder();
		if (processBuilder.environment().get("PORT") != null) {
			return Integer.parseInt(processBuilder.environment().get("PORT"));
		}
		return 4567; // return default port if heroku-port isn't set (i.e. on
						// localhost)
	}

	public static void main(String[] args) {
		port(getHerokuAssignedPort());

		staticFileLocation("/public");
		exception(Exception.class, (e, request, response) -> {
			response.status(500);
			e.printStackTrace();
			response.body(e.getMessage());
		});

		final String mongoClientUri;
		final String databaseName;
		final String mongoLabUri = System.getenv().get("MONGODB_URI");
		if (mongoLabUri == null) {
			mongoClientUri = "mongodb://localhost:27017/tictactoe";
			databaseName = "tictactoe";
		} else {
			mongoClientUri = mongoLabUri;
			databaseName = "heroku_swwtmlzm";
		}
		final MongoClient client = new MongoClient(new MongoClientURI(mongoClientUri));
		final MongoDatabase database = client.getDatabase(databaseName);

		new TicTacToeController(new TicTacToeDao(database));

	}
}
