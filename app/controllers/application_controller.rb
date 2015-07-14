class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  rescue_from ActionController::RoutingError, with: :redirect_form_not_found

  def raise_not_found!
    fail ActionController::RoutingError.new("No route matches #{params[:unmatched_route]}")
  end

  def redirect_form_not_found
    redirect_to '/'
  end
end
