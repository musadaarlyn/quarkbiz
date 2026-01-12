// package com.codebiz.resource;

// import com.codebiz.dto.dashboard.DashboardStatsDTO;
// import com.codebiz.service.DashboardService;
// import jakarta.inject.Inject;
// import jakarta.ws.rs.GET;
// import jakarta.ws.rs.Path;
// import jakarta.ws.rs.Produces;
// import jakarta.ws.rs.core.MediaType;

// @Path("/dashboard")
// @Produces(MediaType.APPLICATION_JSON)
// public class DashboardResource {

// @Inject
// DashboardService service;

// @GET
// @Path("/stats")
// public DashboardStatsDTO getStats() {
// return service.getStats();
// }
// }