package com.codebiz.resource;

import com.codebiz.model.Projects;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/projects")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProjectsResource {

    // CREATE
    @POST
    @Transactional
    public Response create(Projects data) {
        data.persist();
        return Response.status(Response.Status.CREATED).entity(data).build();
    }

    // READ ALL
    @GET
    public List<Projects> listAll() {
        return Projects.listAll();
    }

    // READ BY ID
    @GET
    @Path("/{id}")
    public Projects getById(@PathParam("id") Long id) {
        return Projects.findById(id);
    }

    // UPDATE
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Projects updated) {

        Projects proj = Projects.findById(id);
        if (proj == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        proj.projName = updated.projName;
        proj.projDescription = updated.projDescription;
        proj.techStackIds = updated.techStackIds;     // JSON array as String
        proj.status = updated.status;
        proj.startDate = updated.startDate;
        proj.endDate = updated.endDate;

        return Response.ok(proj).build();
    }

    // DELETE
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = Projects.deleteById(id);

        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.noContent().build();
    }

    // PAGINATION
    @GET
    @Path("/page")
    public List<Projects> paginate(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {

        return Projects.findAll()
                .page(page, size)
                .list();
    }

}
